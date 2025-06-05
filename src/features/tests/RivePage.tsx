import { type ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '../../components/Container/Container.tsx';
import { EventType, type Rive, useRive } from '@rive-app/react-canvas';
import sankeyUrl from '../../images/rive/bifi_sankey_.riv?url';
import { css } from '@repo/styles/css';
import { Button } from '../../components/Button/Button.tsx';
import { isDefined } from '../data/utils/array-utils.ts';
import type { EventCallback } from '@rive-app/canvas';

const RivePage = memo(() => {
  return (
    <Container maxWidth="lg">
      <Sankey />
    </Container>
  );
});

type State = 'loading' | 'loaded' | 'error' | 'playing' | 'paused' | 'stopped';

const Sankey = memo(() => {
  const [state, setState] = useState<State>('loading');

  const onLoad = useCallback(() => {
    setState('loaded');
  }, [setState]);
  const onLoadError = useCallback(() => {
    setState('error');
  }, [setState]);
  const onPlay = useCallback(() => {
    setState('playing');
  }, [setState]);
  const onPause = useCallback(() => {
    setState('paused');
  }, [setState]);
  const onStop = useCallback(() => {
    setState('stopped');
  }, [setState]);

  const { rive, RiveComponent, setContainerRef } = useRive(
    {
      src: sankeyUrl,
      autoplay: true,
      enableRiveAssetCDN: false,
      autoBind: true,
      onLoad,
      onLoadError,
      onPlay,
      onPause,
      onStop,
    },
    {
      fitCanvasToArtboardHeight: true,
      shouldResizeCanvasToContainer: true,
    }
  );

  return (
    <div className={css({ paddingBlock: '16px' })}>
      <RiveDebug rive={rive} state={state} />
      <div className={css({ border: '1px solid #1c7cbb' })}>
        <div ref={setContainerRef}>
          <RiveComponent />
        </div>
      </div>
    </div>
  );
});

type NumberVariable = {
  name: string;
  defaultValue: number;
  value: number;
  onChange: (callback: (value: number) => void) => void;
  off(): void;
};

const RiveDebug = memo(({ rive, state }: { rive: Rive | null; state: State }) => {
  const [loops, setLoops] = useState(0);
  const [frames, setFrames] = useState(0);

  const handlePlay = useCallback(() => {
    rive?.play(rive?.animationNames, true);
  }, [rive]);
  const handleStop = useCallback(() => {
    rive?.stop();
  }, [rive]);
  const handlePause = useCallback(() => {
    rive?.pause();
  }, [rive]);

  const vmi = rive?.viewModelInstance;
  const numberVariables = useMemo(
    () =>
      vmi?.properties
        .filter(
          p =>
            (p.type as unknown as string) === 'number' /* @dev type is wrong in @rive-app/canvas */
        )
        .map((p): NumberVariable | undefined => {
          const instance = vmi?.number(p.name);
          if (!instance) {
            return undefined;
          }

          return {
            name: p.name,
            defaultValue: instance.value,
            get value() {
              return instance.value;
            },
            set value(value: number) {
              instance.value = value;
            },
            onChange(callback: (value: number) => void) {
              instance.on(
                callback as unknown as EventCallback
              ); /* @dev @rive-app/canvas types are wrong */
            },
            off() {
              instance.off();
            },
          };
        })
        .filter(isDefined),
    [vmi]
  );

  useEffect(() => {
    if (rive) {
      const onLoop = () => {
        setLoops(prev => prev + 1);
        setFrames(0);
      };
      const onAdvance = () => {
        if (rive?.isPlaying) {
          setFrames(prev => prev + 1);
        }
      };
      const onStop = () => setFrames(0);

      rive.on(EventType.Loop, onLoop);
      rive.on(EventType.Stop, onStop);
      rive.on(EventType.Advance, onAdvance);

      return () => {
        rive.off(EventType.Loop, onLoop);
        rive.off(EventType.Advance, onAdvance);
        rive.off(EventType.Stop, onStop);
      };
    }
  }, [rive, setLoops, setFrames]);

  return (
    <div>
      <div className={css({ display: 'flex', gap: '4px', alignItems: 'center' })}>
        <div className={css({ width: '140px' })}>State: {state}</div>
        <div className={css({ width: '100px' })}>Loops: {loops}</div>
        <div className={css({ width: '100px' })}> Frame: {frames} </div>
        <Button variant="filter" size="sm" onClick={handlePlay} disabled={state === 'playing'}>
          Play
        </Button>
        <Button variant="filter" size="sm" onClick={handlePause} disabled={state !== 'playing'}>
          Pause
        </Button>
        <Button variant="filter" size="sm" onClick={handleStop} disabled={state !== 'playing'}>
          Stop
        </Button>
      </div>
      {rive && !!numberVariables?.length && <RiveVariables variables={numberVariables} />}
    </div>
  );
});

const RiveVariables = memo(({ variables }: { variables: NumberVariable[] }) => {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(min-content, 1fr))',
        gap: '8px',
      })}
    >
      {variables.map(v => (
        <RiveVariable key={v.name} variable={v} />
      ))}
    </div>
  );
});

const RiveVariable = memo(({ variable: v }: { variable: NumberVariable }) => {
  const [value, setValue] = useState(v.value);
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      setValue(newValue);
      v.value = newValue;
    },
    [v, setValue]
  );

  useEffect(() => {
    v.onChange(setValue);
    return () => {
      v.off();
    };
  }, [v, setValue]);

  return (
    <>
      <label htmlFor={v.name}>{v.name}</label>
      <input
        type="range"
        min={0}
        max={v.defaultValue * 2}
        id={v.name}
        value={value}
        onChange={handleChange}
      />
      {value.toLocaleString()}
    </>
  );
});

// eslint-disable-next-line no-restricted-syntax -- default export required for React.lazy()
export default RivePage;
